import crypto from 'crypto';
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

type IConfig = {
  algorithm: string;
  key: string;
  iv: Buffer | null;
};

/**
 * @see https://nodejs.org/en/knowledge/cryptography/how-to-use-crypto-module/
 */
class Encryption {
  private config: IConfig = {
    algorithm: 'AES-128-CBC',
    iv: crypto.createHash('sha256').update('hashedIV').digest(),
    key: 'myEncriptKey'
  };

  constructor(config: IConfig) {
    this.config = config;
  }
  // you can see the list of hash types by typing  openssl list -cipher-algorithm
  encript(data: string) {}
  decrypt(data: string) {}
}

class FileDataSource implements DataSource {
  writeData(data: string): void {}
  readData(): string {}
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
    return super.readData();
  }
  encryptData(data: string) {
    // return data. ;
  }
  writeData(data: string) {}
}
