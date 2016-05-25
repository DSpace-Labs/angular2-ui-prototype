import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { Item } from '../dspace/models/item.model';
import { SidebarService } from './services/sidebar.service';
import { AuthorizationService } from '../dspace/authorization/services/authorization.service';


/**
 * Class to populate the sidebar on item-view pages.
 */
export class ItemSidebarHelper
{

    /**
     *
     */
    sections : Array<SidebarSection>;


    /**
     *
     * @type {boolean}
     */
    isAuthenticated : boolean = false;


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
    constructor(private sidebarService : SidebarService, private item : Item, private authorization? : AuthorizationService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The item sidebar requires an item object
     * Because we need some data from the item to populate the links
     * @param item
     */
    populateSidebar()
    {

        if(this.authorization != null)
        {
            this.isAuthenticated = this.authorization.isAuthenticated();
        }

        let editItemChildSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.edit")
            .route("E404") // does not exist yet.
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .build();
        let itemSection = SidebarSection.getBuilder()
            .name("sidebar.item-context.header")
            .visible(this.isAuthenticated)
            .visibilityObservable(this.authorization.userObservable)
            .addChild(editItemChildSection)
            .id("itemsidebar")
            .index(2)
            .build();
        this.sections.push(itemSection);
        this.sidebarService.addSection(itemSection);
    }


    /**
     *
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}