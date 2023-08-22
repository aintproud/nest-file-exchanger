import { Controller, Get, Res, ParseUUIDPipe, Param, Post, UseInterceptors, UploadedFiles, ParseFilePipeBuilder, HttpStatus } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';
import { UUID } from 'crypto';
import { AnyFilesInterceptor } from '@nestjs/platform-express';

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
	async downloadZip(@Param('id', new ParseUUIDPipe()) id: UUID, @Res() res: Response) {
		res.sendFile(`data/${id}.zip`, { root: '.' })
		res.status(HttpStatus.OK)

	}
}
