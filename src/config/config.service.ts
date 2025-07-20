let configRecord = { id: 1, name: 'General config', value: '' }

export class ConfigService {
  setConfig(config: object) {
    configRecord.value = JSON.stringify(config)
    return 'The value is set'
  }

  getConfig() {
    return JSON.parse(configRecord.value)
  }
}