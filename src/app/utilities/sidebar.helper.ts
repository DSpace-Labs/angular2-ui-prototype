import { SidebarSection } from '../dspace/models/sidebar/sidebar-section.model';
import { SidebarService } from './services/sidebar.service';

/**
 * super class for the sidebar helpers.
 */
export abstract class SidebarHelper
{


    /**
     *
     * @type {boolean}
     */
    isAuthenticated : boolean = false;


    /**
     * The sections added by the helper.
     */
    sections : Array<SidebarSection>;

    /**
     * @param sidebarService
     *      SidebarService is a singleton service to interact with the content of the sidebars.
     */
    constructor(protected sidebarService : SidebarService)
    {
        this.sections = [];
    }


    /**
     * Populate the sidebar, each child component has it's own implementation of this
     * in which they add the components that they require
     * Optionally can take extra input to create the sidebarsections.
     */
    abstract populateSidebar(input? : any);


    /**
     * Removes the sections that the helper added to the "sections" array.
     */
    removeSections()
    {
        this.sections.forEach(section => this.sidebarService.removeSection(section));
    }


}