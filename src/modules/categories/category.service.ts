import type { CreateCategoryDto } from '../categories/dto/create-category.dto'
import { NotFoundError } from '../../extensions/error.extension'

export class CategoryService {
  private categories = [
    {
      id: 1,
      name: 'Households',
      description: 'Home appliances',
    },
    {
      id: 2,
      name: 'Laptops',
      description: 'All kinds of laptops',
    },
    {
      id: 3,
      name: 'Phones',
      description: 'Smartphones and accessories',
    },
    { id: 4, name: 'Books', description: 'All kinds of books' },
  ]

  getAll() {
    return this.categories
  }

  getOne(id: number) {
    return this.categories.find((cat) => cat.id === id)
  }

  create(params: CreateCategoryDto) {
    const newCategory = {
      id: this.categories.length,
      name: params.name,
      description: params.description,
    }

    this.categories.push(newCategory)
    return newCategory
  }

  update(id: number, params: Partial<CreateCategoryDto>) {
    const category = this.getOne(id)
    if (!category) throw new NotFoundError(`Category with id ${id} not found`, "categories")
    // update with new params
    Object.assign(category, params)
    return category
  }
  
  delete(id: number) {
    const idx = this.categories.findIndex((cat) => cat.id === id)
    if (idx === -1) throw new NotFoundError(`Category with id ${id} not found`, "categories")
    const [deleted] = this.categories.splice(idx, 1)
    return deleted
  }
}
