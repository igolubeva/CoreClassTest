import React from 'react';
import { callApi } from '../../common/apiMiddleware';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import './constants/styles.css';


const apiUrls = ({
    getDataSort: (page, size, sort) => `/api/sources?page=${page}&size=${size}&sort=${sort}`,
    filterByName: (name,page, size, sort) => `api/sources/search/findBySearch?searchTerm=${name}&page=${page}&size=${size}&sort=${sort}`,
});

const sortSelectItems = [
    {label: 'id', value: 'id'},
    {label: 'name', value: 'name'},
    {label: 'value', value: 'value'},
];
export class DataList extends React.Component {

    state = {
        tableData: [],
        nameFilter: '',
        paginator: true,
        first: 0,
        rows: 2,
        rowsNumberInput: 2,
        ascOrder: true,
        sortValue: 'id',
        curPage: 0,
        sortDirection: {
            id: 'asc',
            value: 'asc',
            name: 'asc',
        },
        totalElements: 0,
    };

    componentDidMount() {
        this.loadSortData();
    }

    getRowsCount = () => {
        return this.state.rowsNumberInput ? this.state.rowsNumberInput : this.state.rows;
    };
    getPage = (page, rows) => {
        return page >= (this.state.totalElements/rows) ? 0 : page;
    };

    onPage = (event) => {
        this.setState({
            loading: true,
            curPage: event.page,
        });
        if(this.state.nameFilter) {
            this.loadFilterData(event.page);
        }else {
            this.loadSortData(event.page);
        }
    };

    onSort = (event) => {
        const sortValue = event.value;
        const newDir = this.state.sortDirection[sortValue]=='asc' ? 'desc' : 'asc';
        this.setState({
                loading: true,
                sortValue,
                ascOrder: !this.state.ascOrder,
                sortDirection: {
                ...this.state.sortDirection,
                [sortValue]: newDir},
        });
        if(this.state.nameFilter) {
            this.loadFilterData();
        }else{
            this.loadSortData(this.state.curPage, event.value, newDir);
        }
    };
    loadSortData = (page=this.state.curPage, sortValue=this.state.sortValue,
        sortOrder=this.state.sortDirection[sortValue]) => {
        const rows = this.getRowsCount();
        page = this.getPage(page, rows);
        callApi(apiUrls.getDataSort(
            page, rows, sortValue.concat(',', sortOrder))).then((data) => {
                this.setState({
                    tableData: data._embedded.sources,
                    totalRecords: data.page.totalElements,
                    loading: false,
                    pagination: true,
                    rows: data.page.size,
                    first: data.page.number*data.page.size,
                    totalElements: data.page.totalElements,
                });
            }).catch(() => {
        });
    };
    loadFilterData = (page=this.state.curPage) => {
        const sort = this.state.sortValue;
        const rows = this.getRowsCount();
        page = this.getPage(page, rows);
        callApi(apiUrls.filterByName(this.state.nameFilter, page, rows, sort)).then((data) => {
            this.setState({
                tableData: data._embedded.sources,
                totalRecords: data.page.totalElements,
                loading: false,
                pagination: true,
                rows: data.page.size,
                first: data.page.number * data.page.size,
                totalElements: data.page.totalElements,
            });
        }).catch(() => {
    });
    };
    updateData = () => {
        if(this.state.nameFilter) {
            this.loadFilterData();

        }else {
            this.loadSortData();
        }
    };
    handleClickFilter = () => {
        this.setState({
            loading: true,
        });
        this.updateData();

    };
    onNameFilterChange = (e) => {
        this.setState({
            nameFilter: e.target.value,
        });
    };
    rowsNumberChange = (e) => {
        const val = parseInt(e.target.value, 10);
        if (val){
            this.setState({
                rowsNumberInput: val,
            });
        }else{
            this.setState({
                rowsNumberInput: '',
            });
        }
    };
    changeRowsNumber = () => {
        if(this.state.nameFilter) {
            this.loadFilterData();
        }else {
            this.loadSortData();
        }
    };
    onInputFilterKeyDown = (event) => {
        if(event.key === 'Enter'){
            this.handleClickFilter();
        }
    };
    onRowNumberKeyDown = (event) => {
        if(event.key === 'Enter'){
            this.updateData();
        }
    };
    getSortDirection = (key) => {
        return this.state.sortDirection[key] == 'asc' ?  '↑' : '↓'
    };
    valueTemplate = (option) => {
        const sortDirection = this.getSortDirection(option.value);
        if (!option.value) {
            return option.label;
        }
        else {
            return (
                <div className="p-clearfix">
                    <span style={{float:'right', margin:'.5em .25em 0 0'}}>{option.label} {sortDirection}</span>
                </div>
            );
        }
    };
    render() {
        const dataText = text => (
            <div className="header-text">
                {text}
            </div>
            );
        const nameFilter = (
            <span className="p-float-label">
                <InputText
                    id='float-input'
                    style={{ width: '100%' }}
                    value={this.state.nameFilter}
                    className="ui-column-filter"
                    onChange={this.onNameFilterChange}
                    onKeyDown={(e) => { this.onInputFilterKeyDown(e) } }
                />
                <label htmlFor="float-input">Введите id, name или value</label>
            </span>
                );
        const rowsNumberInput = (
             <span className="p-float-label">
                 <InputText
                     id='float-input'
                     style={{ width: '100%' }}
                     className="ui-column-filter"
                     onChange={this.rowsNumberChange}
                     value={ this.state.rowsNumberInput ? this.state.rowsNumberInput : '' }
                     onKeyDown={ (e) => { this.onRowNumberKeyDown(e) } }
                 />
                 <label htmlFor="float-input">Введите целое число</label>
             </span>
             );
        return (
            <div>
                {dataText('Задача: В браузере отрисовать таблицу с данными сервера.')}
                <div className="main-form">
                    <div className="control-item">
                        <span className="label-control">Фильтр:</span>
                        {nameFilter}
                        <Button label="Ок" onClick={this.handleClickFilter} />
                    </div>
                    <div className="control-item">
                         <span className="label-control">Количество записей на странице:</span>
                         {rowsNumberInput}
                         <Button label="Ок" onClick={this.updateData} />
                     </div>
                    <div className="control-item">
                        <span className="label-control">Сортировка:</span>
                        <Dropdown
                            options={sortSelectItems}
                            onChange={(e) => {this.onSort(e)}}
                            placeholder="Сортировать по..."
                            itemTemplate={this.valueTemplate}
                            />
                    </div>
                </div>
                <DataTable
                    value={this.state.tableData}
                    paginator={this.state.paginator}
                    rows={this.state.rows}
                    first={this.state.first}
                    totalRecords={this.state.totalRecords}
                    lazy={true}
                    onPage={this.onPage}
                    loading={this.state.loading}
                >
                    <Column field="sourceId" header="id" />
                    <Column field="name" header="name" />
                    <Column field="value" header="value" />
                </DataTable>
            </div>
        );
    }
}