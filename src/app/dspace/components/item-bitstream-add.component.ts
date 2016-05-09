import { 
    Component,
    EventEmitter,
    Input,
    Output
} from 'angular2/core';

/**
 * 
 */
@Component({
    selector: 'item-bitstream-add',
    template: ` 
                <hr>
                <label>Bitstreams</label>                        
                <div class="row">
                    <div class="col-md-11 col-xs-10">
                        <span class="btn btn-primary btn-file">
                            Add Bitstream <input type="file" (change)="addBitstream($event)"/>
                        </span>
                    </div>
                </div>
                <fieldset class="form-group">
                    <table class="table table-striped" *ngIf="files.length > 0">
                        <thead>
                            <tr>
                                <td><label>File</label></td>
                                <td><label>Description</label></td>
                                <td><label>Remove</label></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let file of files">
                                <td class="col-md-3 col-xs-2">
                                    <label class="space-top">{{ file.name }}</label>
                                </td>
                                <td class="col-md-9 col-xs-8">
                                    <input class="form-control" type="text" id="{{ file.name }}" [(ngModel)]="file.description">
                                </td>
                                <td class="col-xs-1 text-center">
                                    <span class="glyphicon glyphicon-remove clickable space-top" aria-hidden="true" (click)="removeBitstream(file)"></span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </fieldset>
              `
})
export class ItemBitstreamAddComponent {

    /**
     * Bitstreams.
     */
    @Input("files") private files: Array<any>;

    /**
     * 
     */
    @Output('addBitstreamEmitter') addBitstreamEmitter: EventEmitter<any> = new EventEmitter<any>();
  
    /**
     * 
     */
    @Output('removeBitstreamEmitter') removeBitstreamEmitter: EventEmitter<any> = new EventEmitter<any>();

    /**
     * 
     */
    private addBitstream(event: any): void {
        this.addBitstreamEmitter.next(event);
    }

    /**
     * 
     */
    private removeBitstream(file: any): void {
        this.removeBitstreamEmitter.next(file);
    }

}

                       
