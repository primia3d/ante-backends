import { Injectable, Inject, HttpStatus, NotAcceptableException } from '@nestjs/common';
import { TableBodyDTO, TableQueryDTO } from 'lib/table.dto/table.dto';
import { UtilityService } from 'lib/utility.service';
import tableReference from 'reference/table.reference';

@Injectable()
export class TableHandlerService {
    private query;
    private body;
    private tableInformation:any;
    private siblingsPage:number = 2;
    
    @Inject() private utility:UtilityService;

    initialize(query:TableQueryDTO, body:TableBodyDTO, tableReferenceKey:string) {
        this.query = query;
        this.body = body;
        this.tableInformation = this.getTableReference(tableReferenceKey);
    }
    constructTableQuery() {
        const currentPage = Number(this.query.page);
        const take = Number(this.query.perPage); 
        const sortType = this.query.hasOwnProperty('sortType') ? this.query.sortType : 'asc';
        
        let orderBy = {};
        orderBy[this.tableInformation.defaultOrderBy] = sortType;
        
        if(this.query.hasOwnProperty('sort') && this.query.sort) {
            const customOrderBy = this.tableInformation.sort.find((sort) => sort.key == this.query.sort);

            if(customOrderBy) {
                orderBy = {};
                orderBy[customOrderBy.column] = sortType;
            }
        }

        let skip = 0;
        skip = (currentPage * take) - (take);

        let where = {};

        if(this.body.hasOwnProperty("filters")) {   
            this.body.filters.forEach((filter) => {
                for(let filterKey in filter) {
                    const customFilter = this.tableInformation.filter.find((refFilter) => refFilter.key == filterKey);
                    if(customFilter) {
                        where[customFilter.column] = filter[filterKey];
                    }
                }
            });
        }

        return { take, orderBy, skip, where };
    }
    async getTableData(model, query, tableQuery) {
        const tableData = await model.findMany(tableQuery);
        const perPage = tableQuery.take;
        const currentPage = Number(query.page);
        delete tableQuery.take;
        delete tableQuery.skip;
        delete tableQuery.include;
        delete tableQuery.relationLoadStrategy;
        const totalCount = await model.count(tableQuery);
        const pagination = this.paginate(totalCount, perPage, this.siblingsPage, currentPage);
        return { list:tableData, pagination, currentPage: currentPage, totalCount };
    }
    getTableReference(table) {
        if(!tableReference.hasOwnProperty(table)) throw new NotAcceptableException(`Invalid Table`);
        return tableReference[table];
    }
    range(start, end) {
        let length = end - start + 1;
        return Array.from({ length }, (_, idx) => idx + start);
    }
    paginate(totalCount:number, pageSize:number, siblingCount:number, currentPage:number) {
        const DOTS = '...';
        const totalPageCount = Math.ceil(totalCount / pageSize);
        const totalPageNumbers = siblingCount + 5;
    
        if (totalPageNumbers >= totalPageCount) {
            return this.range(1, totalPageCount);
        }
        
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(
            currentPage + siblingCount,
            totalPageCount
        );
    
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;
    
        const firstPageIndex = 1;
        const lastPageIndex = totalPageCount;
    
        if (!shouldShowLeftDots && shouldShowRightDots) {
            let leftItemCount = 3 + 2 * siblingCount;
            let leftRange = this.range(1, leftItemCount);
        
            return [...leftRange, DOTS, totalPageCount];
        }

        if (shouldShowLeftDots && !shouldShowRightDots) {
            let rightItemCount = 3 + 2 * siblingCount;
            let rightRange = this.range(
                totalPageCount - rightItemCount + 1,
                totalPageCount
            );
            return [firstPageIndex, DOTS, ...rightRange];
        }
         
        if (shouldShowLeftDots && shouldShowRightDots) {
            let middleRange = this.range(leftSiblingIndex, rightSiblingIndex);
            return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
        }
    }
}