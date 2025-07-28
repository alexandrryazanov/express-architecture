import { CreateItemDto } from "./dto/create-item.dto";
import { BadRequestError } from "../../extensions/error.extension";

export let itemsData = [
  { id: 1, name: "item  1" },
  { id: 2, name: "item  2" },
  { id: 3, name: "item  3" },
];

export class ItemsService {
  getAll() {
    return itemsData;
  }

  create(params: CreateItemDto) {
    const findItem = itemsData.find((item) => item.id === params.id);
    if (!findItem) {
      itemsData = [...itemsData, params];
      return params;
    }
    throw new BadRequestError(`Not correct id: ${params.id}`);
  }

  delete(id: number) {
    const findItem = itemsData.find((item) => item.id === Number(id));
    itemsData = itemsData.filter((item) => item.id !== Number(id));
    return findItem;
  }

  getOne(id: number) {
    return itemsData.find((item) => item.id === Number(id));
  }
}
