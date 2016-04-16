
/**
 * 
 */
export interface IPaging {
    
    ready: boolean;
    
    loaded: boolean;
    
    offset: number;

    page: number;

    limit: number;

    component: string;

    pageCount: number;

    total: number;

}