import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { createWriteStream, mkdir, writeFile, writeFileSync } from 'fs';
const JSZip = require('jszip');


@Injectable()
export class AppService {
	async handleFiles(files) {
    const id = randomUUID()
    const zip = new JSZip()
    files.forEach(handledFile => zip.file(handledFile.originalname, handledFile.buffer))
    zip.generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(createWriteStream(`data/${id}.zip`))
    return id
  }
}
