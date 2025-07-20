import { Router } from 'express'
import { validateMiddleware } from '../../middlewares/validation.middleware'
import type { Controller } from '../../types/controller'
import { createCategoryDto } from '../categories/dto/create-category.dto'
import type { CategoryService } from '../categories/category.service'
import { BadRequestError } from '../../extensions/error.extension'

export class CategoryController implements Controller {
  private readonly _path
  private readonly _router

  constructor(private categoryService: CategoryService) {
    this._path = '/categories'
    this._router = Router()
    this.initRoutes()
  }

  get path() {
    return this._path
  }

  get router() {
    return this._router
  }

  private initRoutes() {
    this.router.get('/', (req, res) => {
      const result = this.categoryService.getAll()
      res.send(result)
    })

    this.router.get('/:id', (req, res, next) => {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        return next(
          new BadRequestError('Uncorrect id', 'categories')
        )
      }
      const result = this.categoryService.getOne(id)
      res.send(result)
    })

    this.router.post(
      '/',
      validateMiddleware(createCategoryDto, 'categories'),
      (req, res) => {
        const result = this.categoryService.create(req.body)
        res.send(result)
      }
    )

    this.router.delete('/:id', (req, res, next) => {
      const id = Number(req.params.id)
      if (!Number.isInteger(id) || id <= 0) {
        return next(
          new BadRequestError('Uncorrect id', 'categories')
        )
      }
      const result = this.categoryService.delete(id)
      res.send(result)
    })
  }
}
