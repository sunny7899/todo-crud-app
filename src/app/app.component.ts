import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CarAddEditComponent } from './car-add-edit/car-add-edit.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CoreService } from './core/core.service';
import { Store } from "@ngrx/store";
import { appLoaded, deleteCarItemInitiated, editCarItemFormSubmitted } from './store/cars.actions';
import { selectCarItems } from './store/cars.selector';
import { CarItem } from './models/car';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'carNumber',
    'ownerName',
    'action'
  ];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _dialog: MatDialog,
    private _coreService: CoreService,
    private store: Store
  ) { }

  ngOnInit(): void {
    this.store.dispatch(appLoaded());

    this.getCarDetailsList();
  }

  openAddEditCarForm() {
    const dialogRef = this._dialog.open(CarAddEditComponent);
    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCarDetailsList();
        }
      },
    });
  }

  getCarDetailsList() {
    const carItems$ = this.store.select(selectCarItems);
    carItems$.subscribe((res: CarItem[]) => {
      console.log(res, 'carItems');
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  deleteCar(id: number) {
    console.log(id, 'deleteCarid');
    this.store.dispatch(deleteCarItemInitiated({ carId: id }));
    this._coreService.openSnackBar('Car details deleted!', 'done');
    this.getCarDetailsList();
  }

  openEditForm(data: CarItem) {
    console.log(data, 'openEditForm');

    const dialogRef = this._dialog.open(CarAddEditComponent, {
      data,
    });

    dialogRef.afterClosed().subscribe({
      next: (val) => {
        if (val) {
          this.getCarDetailsList();
        }
      },
    });
  }
}
