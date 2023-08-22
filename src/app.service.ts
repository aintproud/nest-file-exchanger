import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { mkdir, writeFile, writeFileSync } from 'fs';


@Injectable()
export class AppService {
	async handleFiles(files) {
    const id = randomUUID()
    mkdir(`./data/${id}`, (err) => err? console.error(err) : console.log(`folder ${id} created`))
    
    await Promise.all(files.map(async (file) => {
      writeFile(`./data/${id}/${file.originalname}`, file.buffer, (err) => err? console.error(err) : console.log(`file ${file.originalname} created`))
    }))
    
    return id
  }
	async getById(id: string) {
		return 'Hello World!';
	}
}
