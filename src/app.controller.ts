import { Controller, Get, UseFilters, Res, ParseUUIDPipe, Param, Post, UseInterceptors, UploadedFile, UploadedFiles, ParseFilePipeBuilder, HttpStatus, UsePipes, HttpCode } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { UUID } from 'crypto';
import { extname, join } from 'path';
import { diskStorage } from 'multer';
import { AnyFilesInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { createReadStream, readdirSync } from 'fs';
import * as archiver from 'archiver'

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@Get()
	sendFile(@Res() res: Response) {
		res.sendFile('frontend/index.html', { root: '.' })
	}

	@Post()
	@UseInterceptors(AnyFilesInterceptor())
	async uploadFile(@UploadedFiles(
		new ParseFilePipeBuilder()
		  .addMaxSizeValidator({
			maxSize: 1000000
		  })
		  .build({
			errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
		  }),
	  ) files: Array<Express.Multer.File>, @Res () res: Response) {
		const id = await this.appService.handleFiles(files);
		res.status(HttpStatus.OK).json({ id });
	}

	@Get(':id')
	async downloadZip(@Res() res: Response) {
		const output = createReadStream(join(__dirname, 'archive.zip'));
	
		res.writeHead(200, {
		  'Content-Type': 'application/zip',
		  'Content-Disposition': 'attachment; filename=archive.zip',
		});
	
		const archive = archiver('zip');
	
		archive.pipe(res);
		archive.directory('../data', false);
		archive.finalize();
	  }
}
