import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile, writeFileSync } from 'fs';


@Injectable()
export class AppService {
	async handleFiles(files) {
    const uuid = randomUUID()
    mkdir(`./data/${uuid}`, (err) => err? console.error(err) : console.log(`folder ${uuid} created`))
    
    await Promise.all(files.map(async (file) => {
      writeFile(`./data/${uuid}/${file.originalname}`, file.buffer, (err) => err? console.error(err) : console.log(`file ${file.originalname} created`))
    }))
  }
	async getById(id: string) {
		return 'Hello World!';
	}
}
