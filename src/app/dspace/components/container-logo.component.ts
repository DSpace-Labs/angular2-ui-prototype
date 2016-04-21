import {Component} from "angular2/core";
import {Bitstream} from "../models/bitstream.model";

/**
 * A Component to render a logo
 */
@Component({
    selector: 'container-logo',
    inputs: ['logo'],
    template: `
                <!--//TODO i18n: alt-->
                <p><img class="logo img-responsive" src="{{ logo.retrieveLink }}" alt="logo"></p>
              `
})
export class ContainerLogoComponent {

    /**
     * The Bitstream representing the logo
     */
    logo: Bitstream;

}
