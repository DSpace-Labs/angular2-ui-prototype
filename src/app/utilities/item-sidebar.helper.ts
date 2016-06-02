import { Inject, Injectable } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';
import { SidebarHelper } from './sidebar.helper';

/**
 * Class to populate the sidebar on item-view pages.
 */
@Injectable()
export class ItemSidebarHelper extends SidebarHelper
{

    /**
     *
     * @param sidebarService
     *       SidebarService is a singleton service to interact with our sidebar
     * @param item
     *       Item is the current item that has added these sections to the sidebar.
     *       We want this to provide the ID of the item as RouteParams
     * @param authorization
     *      AuthorizationService is a singleton service to interact with the authorization service.
     */
    constructor(@Inject(SidebarService) sidebarService : SidebarService, @Inject(AuthorizationService) private authorization : AuthorizationService)
    {
        super(sidebarService);
    }

    /**
     * The item sidebar requires an item object
     * Because we need some data from the item to populate the links
     * @param item
     */
    populateSidebar()
    {

        this.isAuthenticated = this.authorization.isAuthenticated();


        let editItemChildSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.edit")
            .action("Edit")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .build();
        let itemSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.header")
            .testFunction( () => {
                return this.authorization.isAuthenticated();
            })
            .dirtyObservable(this.authorization.userObservable)
            .addChild(editItemChildSection)
            .id("itemsidebar")
            .index(2)
            .build();
        this.sections.push(itemSection);
        this.sidebarService.addSection(itemSection);
    }
}