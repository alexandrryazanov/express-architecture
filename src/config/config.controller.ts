import { Router } from 'express'
import type { Controller } from '../types/controller'
import { ConfigService } from './config.service'

export class ConfigController implements Controller {
  private readonly _path
  private readonly _router

  constructor(private configService: ConfigService) {
    this._path = '/config'
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
    this.router.post('/', (req, res) => {
      const result = this.configService.setConfig(req.body)
      res.send(result)
    })
    this.router.get('/', (req, res) => {
      const result = this.configService.getConfig()
      res.send(result)
    })
  }
}