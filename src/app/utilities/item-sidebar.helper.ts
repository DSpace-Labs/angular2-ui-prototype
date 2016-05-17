import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
import { Item } from '../dspace/models/item.model';
import { SidebarService } from './services/sidebar.service';


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
     * @param sidebarService
     */
    constructor(private sidebarService : SidebarService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
    }

    /**
     * The item sidebar requires an item object
     * Because we need some data from the item to populate the links
     * @param item
     */
    populateSidebar(item : Item)
    {
        let editSection = SidebarSection.getBuilder().name("sidebar.item-context.edit").route("Home").build();
        let viewSection = SidebarSection.getBuilder().name("sidebar.item-context.view").route("Home").routeid(item.id).build();
        let itemSection = SidebarSection.getBuilder().name("sidebar.item-context.header").addChild(viewSection).addChild(editSection).id("itemsidebar").index(2).build();
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