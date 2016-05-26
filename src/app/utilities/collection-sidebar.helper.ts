import { Inject, Injectable } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Collection } from '../dspace/models/collection.model';
import { SidebarService } from './services/sidebar.service';

import { AuthorizationService } from '../dspace/authorization/services/authorization.service';
import { SidebarHelper } from './sidebar.helper';

/**
 * Class to populate the sidebar on collection pages.
 */
@Injectable()
export class CollectionSidebarHelper extends SidebarHelper
{


    /**
     *
     * @param sidebarService
     *    SidebarService is a singleton service to interact with our sidebar
     * @param authorization (optional)
     *      AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(@Inject(SidebarService) sidebarService : SidebarService, @Inject(AuthorizationService) private authorization : AuthorizationService) // can not put collection in here anymore because we will let DI take care of this.
    {
        super(sidebarService); // super implements this as 'protected', this it becomes a class variable of the parent
    }


    /**
     * The collection sidebar requires a collection object
     * Because we need some data from the collection to populate the links
     */
    populateSidebar(collection) // at the moment the passed collection is not used, but for the future edit links it will be used.
    {

        this.isAuthenticated = this.authorization.isAuthenticated();

        let browseChildSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.edit")
            .route("E404")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .dirtyTest(() => {return true}) // left this is as an example
            .build()

        let addItemSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.create-item")
            .route("ItemCreate")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();

        let collectionSection = SidebarSection.getBuilder()
            .name("sidebar.context-collection.header")
            .id("context-collection")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .addChildren([browseChildSection,addItemSection])
            .build();
        this.sidebarService.addSection(collectionSection);
        this.sections.push(collectionSection);
    }
}