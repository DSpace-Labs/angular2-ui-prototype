import { Inject } from '@angular/core';
import { SidebarSection } from '../dspace/models/sidebar-section.model';
import { Item } from '../dspace/models/item.model';
import { SidebarService } from './services/sidebar.service';
/**
 * Class to populate the sidebar on item-view pages.
 */

export class ItemSidebarHelper
{

    sidebarService;
    sections : Array<SidebarSection>;
    constructor(@Inject(SidebarService) sidebarService : SidebarService)
    {
        this.sidebarService = sidebarService;
        this.sections = [];
        console.log("in the constructor of the item-sidebar helper");
    }

    populateSidebar(item : Item)
    {
        console.log("populating the sidebar");
        // you can add routes as an object, or seperately by chaining "route"
        let editSection = SidebarSection.getBuilder().name("sidebar.item-context.edit").route("Home").build();
        let viewSection = SidebarSection.getBuilder().name("sidebar.item-context.view").route("Home").routeid(item.id).build();
        let itemSection = SidebarSection.getBuilder().name("sidebar.item-context.header").addChild(viewSection).addChild(editSection).id("itemsidebar").index(2).build();
        this.sections.push(itemSection);
        this.sidebarService.addSection(itemSection);
    }

    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }
}