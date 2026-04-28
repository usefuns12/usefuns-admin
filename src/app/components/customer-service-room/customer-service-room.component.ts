import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomerServiceRoomService } from '../../services/customer-service-room.service';

@Component({
  selector: 'app-customer-service-room',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './customer-service-room.component.html',
  styleUrl: './customer-service-room.component.scss',
})
export class CustomerServiceRoomComponent implements OnInit {
  rooms: any[] = [];
  isLoading = false;
  private convertingRoomIds = new Set<string>();

  constructor(
    private customerServiceRoomService: CustomerServiceRoomService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadRooms();
  }

  loadRooms(): void {
    this.isLoading = true;
    this.customerServiceRoomService.getCountryAdminRooms().subscribe({
      next: (resp) => {
        this.rooms = resp?.data || [];
        this.isLoading = false;
      },
      error: (err) => {
        this.isLoading = false;
        this.toastr.error(
          err?.error?.message || 'Unable to load country admin rooms.'
        );
      },
    });
  }

  isConverted(room: any): boolean {
    return room?.roomType === 'customer_service';
  }

  isConverting(roomId: string): boolean {
    return this.convertingRoomIds.has(roomId);
  }

  convertRoom(room: any): void {
    if (!room?._id || this.isConverted(room) || this.isConverting(room._id)) {
      return;
    }

    this.convertingRoomIds.add(room._id);
    this.customerServiceRoomService
      .convertToCustomerServiceRoom(room._id)
      .subscribe({
        next: (resp) => {
          room.roomType = 'customer_service';
          this.toastr.success(resp?.message || 'Room converted successfully.');
          this.convertingRoomIds.delete(room._id);
        },
        error: (err) => {
          this.convertingRoomIds.delete(room._id);
          this.toastr.error(
            err?.error?.message || 'Failed to convert room. Please try again.'
          );
        },
      });
  }

  trackByRoomId = (_: number, item: any) => item?._id || item?.roomId;
}
