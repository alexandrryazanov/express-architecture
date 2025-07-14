let configRecord = { id: 1, name: "General config", value: "" }; // это типа строчка в БД

export class ConfigService {
  setConfig(config: object) {
    configRecord.value = JSON.stringify(config);
  }

  getConfig() {
    return JSON.parse(configRecord.value);
  }
}
