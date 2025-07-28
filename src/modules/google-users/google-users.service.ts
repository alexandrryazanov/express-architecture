import type { PostgresService } from "../postgres/postgres.services";
import type { RedisService } from "../redis/redis.services";
import type { UsersService } from "../users/users.service";
import type { CreateGoogleUserDto } from "./dto/create-google-user.dto";
import { BadRequestError } from "../../extensions/error.extension";

export class GoogleUsersService {
  constructor(
    private postgresService: PostgresService,
    private redisService: RedisService,
    private usersService: UsersService,
  ) {}

  async getAll({
    limit = 10,
    offset = 0,
  }: { limit?: number; offset?: number } = {}) {
    const cacheKey = `google-users:${limit}:${offset}`;
    const cachedGroups = await this.redisService.client.get(cacheKey);
    if (cachedGroups) return JSON.parse(cachedGroups);

    const { rows: groups } = await this.postgresService.client.query(
      `SELECT ug.id, ug.name, COALESCE(ARRAY_AGG(ugm.user_id) FILTER (WHERE ugm.user_id IS NOT NULL), '{}') as user_ids
       FROM google_users ug
       LEFT JOIN google_user_members ugm ON ug.id = ugm.group_id
       GROUP BY ug.id, ug.name
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    await this.redisService.client.set(cacheKey, JSON.stringify(groups));
    return groups;
  }

  async create({ name, userIds }: CreateGoogleUserDto) {
    // Проверка существования всех userIds через UsersService
    for (const userId of userIds) {
      const user = this.usersService.getOne(userId);
      if (!user) {
        throw new BadRequestError(`User with id ${userId} does not exist`);
      }
    }

    // Создание группы
    const { rows: [group] } = await this.postgresService.client.query(
      `INSERT INTO google_users (name) VALUES ($1) RETURNING id, name`,
      [name],
    );

    // Добавление связей с пользователями
    if (userIds.length > 0) {
      const values = userIds
        .map((userId) => `(${group.id}, ${userId})`)
        .join(",");
      await this.postgresService.client.query(
        `INSERT INTO google_user_members (group_id, user_id) VALUES ${values}`,
      );
    }

    // Сброс кэша
    await this.redisService.client.del("google-users:*");

    return { ...group, userIds };
  }

  async getOne(id: number) {
    const cacheKey = `google-user:${id}`;
    const cachedGroup = await this.redisService.client.get(cacheKey);
    if (cachedGroup) return JSON.parse(cachedGroup);

    const { rows: [group] } = await this.postgresService.client.query(
      `SELECT ug.id, ug.name, COALESCE(ARRAY_AGG(ugm.user_id) FILTER (WHERE ugm.user_id IS NOT NULL), '{}') as user_ids
       FROM google_users ug
       LEFT JOIN google_user_members ugm ON ug.id = ugm.group_id
       WHERE ug.id = $1
       GROUP BY ug.id, ug.name`,
      [id],
    );

    if (!group) {
      throw new BadRequestError(`Group with id ${id} not found`);
    }

    await this.redisService.client.set(cacheKey, JSON.stringify(group));
    return group;
  }

  async delete(id: number) {
    const { rows: [group] } = await this.postgresService.client.query(
      `DELETE FROM google_users WHERE id = $1 RETURNING id, name`,
      [id],
    );

    if (!group) {
      throw new BadRequestError(`Group with id ${id} not found`);
    }

    // Удаление связей
    await this.postgresService.client.query(
      `DELETE FROM google_user_members WHERE group_id = $1`,
      [id],
    );

    // Сброс кэша
    await this.redisService.client.del("google-users:*");
    await this.redisService.client.del(`google-user:${id}`);

    return { ...group, userIds: [] };
  }
}