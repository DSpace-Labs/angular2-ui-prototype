
/**
 * 
 */
export interface IPaging {
    
    ready: boolean;
    
    loaded: boolean;
    
    component: string;

    pageCount: number;

    limit: number;

    offset: number;

    page: number;

    total: number;

}