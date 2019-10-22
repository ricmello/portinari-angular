import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import * as utilsFunctions from '../../../utils/util';
import { configureTestSuite } from '../../../util-test/util-expect.spec';

import { PoFieldModule } from '../../po-field';
import { PoPopoverModule } from '../../po-popover';

import { PoTableColumnManagerComponent } from './po-table-column-manager.component';
import { PoTableModule } from '../po-table.module';

describe('PoTableColumnManagerComponent:', () => {
  let component: PoTableColumnManagerComponent;
  let fixture: ComponentFixture<PoTableColumnManagerComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ ],
      imports: [ PoPopoverModule, PoFieldModule, PoTableModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PoTableColumnManagerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Methods:', () => {

    it('ngOnInit: should call `updateColumnsOptions` with `columns`', () => {
      component.columns = [
        { property: 'id', label: 'Code', type: 'number' },
        { property: 'initial', label: 'initial' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
        { property: 'atualization', label: 'Atualization', type: 'date' }
      ];

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnInit();

      expect(component['updateColumnsOptions']).toHaveBeenCalledWith(component.columns);
    });

    it(`ngOnChanges: should set 'defaultColumns' with 'columns.currentValue' if 'defaultColumns' and ' currentValue'
      are different`, () => {

      component['defaultColumns'] = <any>['column 1'];

      const changes = {
        columns : {
        firstChange: false,
        currentValue: ['column 3', 'column 4']
        }
      };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['defaultColumns']).toEqual(<any>changes.columns.currentValue);
    });

    it(`ngOnChanges: should set 'defaultColumns' with 'columns.currentValue' if 'firstChange' is true and 'currentValue'
      not is empty`, () => {

      component['defaultColumns'] = <any>[];
      const changes = {
        columns : {
        firstChange: true,
        currentValue: ['column 1']
        }
      };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['defaultColumns']).toEqual(<any>changes.columns.currentValue);
    });

    it(`ngOnChanges: should set 'defaultColumns' with empty array if 'firstChange' is true and 'currentValue' is undefined`, () => {

      component['defaultColumns'] = <any>[];

      const changes = {
        columns : {
        firstChange: true,
        currentValue: undefined
        }
      };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['defaultColumns']).toEqual([]);
    });

    it(`ngOnChanges: shouldn't set 'defaultColumns' with 'columns.currentValue' if 'defaultColumns' and 'currentValue' is
     equal and 'firstChange' is false`, () => {

      component['defaultColumns'] = <any>['column 3', 'column 4'];

      const changes = {
        columns : {
        firstChange: false,
        currentValue: ['column 3', 'column 4']
        }
      };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['defaultColumns']).not.toBe(<any>changes.columns.currentValue);
    });

    it(`ngOnChanges: should call 'updateColumnsOptions' with 'columns' if 'maxColumns' is defined`, () => {
      component.columns = [
        { property: 'id', label: 'Code' },
        { property: 'initial', label: 'initial' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total' },
        { property: 'atualization', label: 'Atualization' }
      ];

      const changes = { columns: undefined, maxColumns: 2 };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['updateColumnsOptions']).toHaveBeenCalledWith(component.columns);
    });

    it(`ngOnChanges: should call 'updateColumnsOptions' with 'currentValue' if 'previousValue' and ' currentValue' are different`, () => {
      const changes = {
        columns: {
          previousValue: [
            { property: 'name', label: 'Name' },
            { property: 'total', label: 'Total' },
          ],
          currentValue: [
            { property: 'name', label: 'Name' },
          ]
        }
      };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['updateColumnsOptions']).toHaveBeenCalledWith(changes.columns.currentValue);
    });

    it(`ngOnChanges: shouldn't call 'updateColumnsOptions' if 'previousValue' and ' currentValue' are equals
      and 'maxColumns' is undefined`, () => {

      const changes = {
        columns: {
          previousValue: [
            { property: 'name', label: 'Name' },
          ],
          currentValue: [
            { property: 'name', label: 'Name' },
          ]
        },
        maxColumns: undefined
      };

      spyOn(component, <any>'updateColumnsOptions');

      component.ngOnChanges(<any>changes);

      expect(component['updateColumnsOptions']).not.toHaveBeenCalled();
    });

    it('onChangeColumns: should call `disabledColumns` with `columnsOptions`', () => {
      const checkedColumns = ['initial', 'name'];
      component.columnsOptions = [{ value: 'column', label: 'Column', disabled: false }];

      spyOn(component, <any>'disabledColumns');

      component.onChangeColumns(checkedColumns);

      expect(component['disabledColumns']).toHaveBeenCalledWith(component.columnsOptions);
    });

    it(`onChangeColumns: should call 'getVisibleTableColumns' to set 'visibleColumnsChange' and call 'visibleColumnsChange.emit'`, () => {
      const checkedColumns = ['initial', 'name'];

      const visibleColumnsChange = ['initial'];

      spyOn(component, <any>'getVisibleTableColumns').and.returnValue(visibleColumnsChange);
      spyOn(component.visibleColumnsChange, 'emit');

      spyOn(component, <any>'disabledColumns');

      component.onChangeColumns(checkedColumns);

      expect(component.visibleColumnsChange.emit).toHaveBeenCalledWith(visibleColumnsChange);
    });

    it('restore: should call `updateColumnsOptions` with `defaultColumns`', () => {
      spyOn(component, <any>'updateColumnsOptions');

      component['defaultColumns'] = component.columns;

      component.restore();

      expect(component['updateColumnsOptions']).toHaveBeenCalledWith(component['defaultColumns']);
    });

    it('disabledColumns: should disable columns that exceeds the maximum value of columns', fakeAsync(() => {
      component.maxColumns = 2;
      component.columnsOptions = undefined;

      component.visibleColumns = [ 'id', 'initial' ];

      const columns = [
        { value: 'id', label: 'Code' },
        { value: 'initial', label: 'initial' },
        { value: 'name', label: 'Name' },
        { value: 'total', label: 'Total' },
        { value: 'atualization', label: 'Atualization' }
      ];

      const columnsOptionsExpected = [
        { value: 'id', label: 'Code', disabled: false },
        { value: 'initial', label: 'initial', disabled: false },
        { value: 'name', label: 'Name', disabled: true },
        { value: 'total', label: 'Total', disabled: true },
        { value: 'atualization', label: 'Atualization', disabled: true }
      ];

      component['disabledColumns'](columns);

      tick();

      expect(component.columnsOptions).toEqual(columnsOptionsExpected);
    }));

    it('disabledColumns: should set `columnsOptions` with empty array if `columns` is undefined ', fakeAsync(() => {
      component.columnsOptions = undefined;
      const columns = undefined;
      const columnsOptionsExpected = [];

      component['disabledColumns'](columns);

      tick();

      expect(component.columnsOptions).toEqual(columnsOptionsExpected);
    }));

    it(`getColumnTitleLabel: should return 'column.label' if it has 'column.label'`, () => {
      const fakeColumn = { property: 'name', label: 'Name' };

      expect(component['getColumnTitleLabel'](<any>fakeColumn)).toBe(fakeColumn.label);
    });

    it(`getColumnTitleLabel: should call 'capitalizeFirstLetter' to set 'getColumnTitleLabel' if 'column.label' is undefined`, () => {
      const fakeColumn = { property: 'name' };
      const label = 'Name';

      spyOn(utilsFunctions, <any>'capitalizeFirstLetter').and.returnValue(label);

      expect(component['getColumnTitleLabel'](fakeColumn)).toBe(label);
      expect(utilsFunctions.capitalizeFirstLetter).toHaveBeenCalledWith(fakeColumn.property);
    });

    it(`getColumnTitleLabel: should return false if 'column.label' and 'column.property' are undefined`, () => {
      const fakeColumn = { value: 'name' };

      spyOn(utilsFunctions, <any>'capitalizeFirstLetter').and.returnValue(false);

      expect(component['getColumnTitleLabel'](<any>fakeColumn)).toBeFalsy();
    });

    it(`getVisibleColumns: should return visible columns`, () => {
      const columns = [
        { property: 'id', label: 'Code', visible: true },
        { property: 'initial', label: 'initial', visible: true },
        { property: 'name', label: 'Name', visible: false },
        { property: 'total', label: 'Total', visible: false },
        { property: 'atualization', label: 'Atualization', visible: true }
      ];

      const visibleColumns = [ 'id', 'initial', 'atualization' ];

      component.maxColumns = 3;

      const result = component['getVisibleColumns'](columns);

      expect(result).toEqual(visibleColumns);
    });

    it(`getVisibleColumns: should return two visible columns if 'maxColumns' is two`, () => {
      const columns = [
        { property: 'id', label: 'Code', visible: true },
        { property: 'initial', label: 'initial', visible: true },
        { property: 'name', label: 'Name', visible: false },
        { property: 'total', label: 'Total', visible: false },
        { property: 'atualization', label: 'Atualization', visible: true }
      ];

      const visibleColumns = [ 'id', 'initial' ];

      component.maxColumns = 2;

      const result = component['getVisibleColumns'](columns);

      expect(result).toEqual(visibleColumns);
    });

    it(`getVisibleColumns: should return one visible column if 'maxColumns' is two
      and has only one column with visible equal to true `, () => {

      const columns = [
        { property: 'id', label: 'Code', visible: false },
        { property: 'initial', label: 'initial', visible: true },
        { property: 'name', label: 'Name', visible: false },
        { property: 'total', label: 'Total', visible: false },
        { property: 'atualization', label: 'Atualization', visible: false }
      ];

      const visibleColumns = [ 'initial' ];

      component.maxColumns = 2;

      const result = component['getVisibleColumns'](columns);

      expect(result).toEqual(visibleColumns);
    });

    it(`getVisibleTableColumns: should return table columns with visible property for visible columns`, () => {
      component.columns = [
        { property: 'id', label: 'Code', type: 'number' },
        { property: 'initial', label: 'initial', type: 'detail' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
        { property: 'atualization', label: 'Atualization', type: 'date' }
      ];

      const columnsExpected = [
        { property: 'id', label: 'Code', type: 'number', visible: false },
        { property: 'initial', label: 'initial', type: 'detail', visible: true },
        { property: 'name', label: 'Name', visible: true },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL', visible: false },
        { property: 'atualization', label: 'Atualization', type: 'date', visible: true }
      ];

      const visibleColumns = [ 'name', 'atualization' ];

      const result = component['getVisibleTableColumns'](visibleColumns);

      expect(result).toEqual(columnsExpected);
    });

    it(`isDisableColumn: should return true if 'visibleColumns' equals 'maxColumns' and 'visibleColumns'
      does not contain 'property'`, () => {

      component.visibleColumns = [ 'column 1', 'column 2' ];
      component.maxColumns = 2;

      expect(component['isDisableColumn']('column 3')).toBe(true);
    });

    it(`isDisableColumn: should return true if 'visibleColumns' is greater than 'maxColumns' and 'visibleColumns'
      does not contain 'property'`, () => {

        component.visibleColumns = [ 'column 1', 'column 2', 'column 3' ];
        component.maxColumns = 2;

        expect(component['isDisableColumn']('column 4')).toBe(true);
    });

    it(`isDisableColumn: should return false if 'visibleColumns' equals 'maxColumns' and 'visibleColumns' contain 'property'`, () => {
      component.visibleColumns = [ 'column 1', 'column 2' ];
      component.maxColumns = 2;

      expect(component['isDisableColumn']('column 2')).toBe(false);
    });

    it(`isDisableColumn: should return false if 'visibleColumns' is greater than 'maxColumns' and 'visibleColumns'
      contain 'property'`, () => {

      component.visibleColumns = [ 'column 1', 'column 2', 'column 3' ];
      component.maxColumns = 2;

      expect(component['isDisableColumn']('column 3')).toBe(false);
    });

    it(`isDisableColumn: should return false if 'visibleColumns' is less than 'maxColumns'`, () => {

      component.visibleColumns = [ 'column 1' ];
      component.maxColumns = 2;

      expect(component['isDisableColumn']('column 2')).toBe(false);
    });

    it(`mapTableColumnsToCheckboxOptions: should convert table columns to checkbox options and return it without detail columns`, () => {
      const tableColumns = [
        { property: 'id', label: 'Code', type: 'number' },
        { property: 'initial', label: 'initial', type: 'detail' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
        { property: 'atualization', label: 'Atualization', type: 'date' }
      ];

      spyOn(component, <any>'isDisableColumn').and.returnValues(false, true, true, true);

      const checkboxOptions = [
        { value: 'id', label: 'Code', disabled: false },
        { value: 'name', label: 'Name', disabled: true },
        { value: 'total', label: 'Total', disabled: true },
        { value: 'atualization', label: 'Atualization', disabled: true }
      ];

      const result = component['mapTableColumnsToCheckboxOptions'](tableColumns);

      expect(result).toEqual(checkboxOptions);
    });

    it(`mapTableColumnsToCheckboxOptions: should return empty array if 'tableColumns' is undefined`, () => {
      const tableColumns = undefined;

      const result = component['mapTableColumnsToCheckboxOptions'](tableColumns);

      expect(result).toEqual([]);
    });

    describe('updateColumnsOptions:', () => {
      const columns = [
        { property: 'id', label: 'Code', type: 'number' },
        { property: 'initial', label: 'initial', type: 'detail' },
        { property: 'name', label: 'Name' },
        { property: 'total', label: 'Total', type: 'currency', format: 'BRL' },
        { property: 'atualization', label: 'Atualization', type: 'date' }
      ];

      it(`should call 'getVisibleColumns' with 'columns' to set 'visibleColumns'`, () => {
        const visibleColumns = [ 'code', 'name' ];
        component.visibleColumns = undefined;

        spyOn(component, <any>'getVisibleColumns').and.returnValue(visibleColumns);
        spyOn(component, <any>'onChangeColumns');
        spyOn(component, <any>'mapTableColumnsToCheckboxOptions');

        component['updateColumnsOptions'](columns);

        expect(component['getVisibleColumns']).toHaveBeenCalledWith(columns);
        expect(component.visibleColumns).toEqual(visibleColumns);
      });

      it(`should call 'onChangeColumns' with 'visibleColumns'`, () => {
        const visibleColumns = [ 'code', 'name' ];
        component.visibleColumns = undefined;

        spyOn(component, <any>'getVisibleColumns').and.returnValue(visibleColumns);
        spyOn(component, <any>'mapTableColumnsToCheckboxOptions');
        spyOn(component, <any>'onChangeColumns');

        component['updateColumnsOptions'](columns);

        expect(component['onChangeColumns']).toHaveBeenCalledWith(visibleColumns);
      });

      it(`should call 'mapTableColumnsToCheckboxOptions' with 'columns' to set 'columnsOptions'`, () => {
        const columnsOptions = [
          { value: 'id', label: 'Code', disabled: false },
          { value: 'name', label: 'Name', disabled: true },
          { value: 'total', label: 'Total', disabled: true },
          { value: 'atualization', label: 'Atualization', disabled: true }
        ];

        spyOn(component, <any>'getVisibleColumns');
        spyOn(component, <any>'onChangeColumns');
        spyOn(component, <any>'mapTableColumnsToCheckboxOptions').and.returnValue(columnsOptions);

        component['updateColumnsOptions'](columns);

        expect(component['mapTableColumnsToCheckboxOptions']).toHaveBeenCalledWith(columns);
        expect(component.columnsOptions).toEqual(columnsOptions);
      });
    });

  });

});
