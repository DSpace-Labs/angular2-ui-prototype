import { Component, Input } from '@angular/core';
import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass, NgStyle } from '@angular/common';
import { FILE_UPLOAD_DIRECTIVES, FileUploader } from 'ng2-file-upload/ng2-file-upload';

/**
 * Component which provides the ability to add bitstreams to a queue to be uploaded.
 * This component uses ng2-file-upload: https://github.com/valor-software/ng2-file-upload/
 */
@Component({
    selector: 'item-bitstream-add',
    directives: [ CORE_DIRECTIVES,
                  FORM_DIRECTIVES,
                  FILE_UPLOAD_DIRECTIVES,
                  NgClass,
                  NgStyle ],
    template: `
                <hr>
                <label for="file-upload">Upload File(s)</label>
                <div class="row">
                    <div class="col-md-12 col-xs-10">
                        <div ng2FileDrop
                            [ngClass]="{'file-over-drop-zone': fileOverDropzone}"
                            (fileOver)="fileOver($event)"
                            [uploader]="uploader"
                            class="well file-drop-zone">
                            <span class="btn btn-primary btn-file">
                                Choose file(s) <input id="file_upload" type="file" ng2FileSelect [uploader]="uploader" multiple  />
                            </span>
                            OR Drop files here
                        </div>

                    </div>
                </div>
                <fieldset class="form-group">
                    <table class="table table-striped" *ngIf="uploader.queue.length > 0">
                        <thead>
                            <tr>
                                <td><label>Selected Files ({{uploader.queue.length}})</label></td>
                                <td><label>Size</label></td>
                                <td><label>Description (optional)</label></td>
                                <td><label>Remove</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let item of uploader.queue">
                                <td class="col-md-3 col-xs-2">
                                    <label class="space-top">{{ item.file.name }}</label>
                                </td>
                                <td class="col-md-3 col-xs-2">
                                    <label class="space-top">{{ item.file.size }}</label>
                                </td>
                                <!-- TODO: This is a slight 'hack'. We want to allow defining a description for files.
                                     In this situation, we'll use the 'alias' field of the ng2-file-upload Item to store the description. -->
                                <td class="col-md-5 col-xs-4">
                                    <input class="form-control" type="text" id="{{ item?.file?.name }}" [(ngModel)]="item.alias">
                                </td>-
                                <td class="col-xs-1 text-center">
                                    <span class="glyphicon glyphicon-remove clickable space-top" aria-hidden="true" (click)="item.remove()"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </fieldset>
            `
})
export class ItemBitstreamAddComponent {

    /**
     * FileUploader is passed in from the parent component
     */
    @Input("uploader") private uploader: FileUploader;

    // Whether a file is hovering over a dropzone (for drag and drop)
    public fileOverDropzone:boolean = false;

    /**
     * If file is over the drop zone, change flag. This lets us change the styles dynamically.
     */
    public fileOver(e:any):void {
        this.fileOverDropzone = e;
    }
}
