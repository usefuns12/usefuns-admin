import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { TreasureBoxLevelService } from '../../services/treasurebox-level.service';
import { TreasureBoxLevelFormComponent } from './treasurebox-level-form/treasurebox-level-form.component';

@Component({
  selector: 'app-treasurebox-level',
  standalone: true,
  templateUrl: './treasurebox-level.component.html',
  imports: [CommonModule, MatTooltipModule, FontAwesomeModule],
})
export class TreasureBoxLevelComponent implements OnInit {
  levels: any[] = [];
  isLoading = false;

  constructor(
    private treasureboxService: TreasureBoxLevelService,
    private dialog: MatDialog,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.getLevels();
  }

  getLevels(): void {
    this.isLoading = true;
    this.treasureboxService.getLevels().subscribe({
      next: (resp) => {
        this.levels = resp.data || [];
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  openDialog(mode: 'add' | 'edit', level: any = null): void {
    const dialogRef = this.dialog.open(TreasureBoxLevelFormComponent, {
      width: '700px',
      disableClose: true,
      data: { mode, level },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result?.refresh) {
        this.getLevels();
        this.toastr.success(result.message);
      }
    });
  }
}
