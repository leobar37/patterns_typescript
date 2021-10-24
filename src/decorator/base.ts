interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

class FileDataSource implements DataSource {
  data: string;
  writeData(data: string): void {
    this.data = data;
  }
  readData(): string {
    return this.data;
  }
}

class DataSourceDecorator implements DataSource {
  wrapper: DataSource;
  constructor(source: DataSource) {
    this.wrapper = source;
  }
  writeData(data: string): void {
    this.wrapper.writeData(data);
  }
  readData(): string {
    return this.wrapper.readData();
  }
}

class EncryptDataSource extends DataSourceDecorator {
  readData() {
    const data = super.readData();
    return this.decryptData(data);
  }
  decryptData(data: string) {
    return data.replace('encrypt:', '');
  }
  encryptData(data: string) {
    return `encrypt:${data}`;
  }
  writeData(data: string) {
    const res = this.encryptData(data);
    super.writeData(res);
  }
}

const datasSource = new FileDataSource();

const ecryptData = new EncryptDataSource(datasSource);
