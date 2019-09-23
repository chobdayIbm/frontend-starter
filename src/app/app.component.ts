import { Component } from "@angular/core";

import { MainService } from "./services/main.service";
import { ToastService } from './components/toast/toast.service';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "frontend-starter";
  isLoadingPublic = false;
  isLoadingPrivate = false;
  publicResponse: any;

  constructor(
    private mainService: MainService,
    private toastService: ToastService
  ) {
    this.mainService.getMe().subscribe((res: { accessToken: string }) => {
      localStorage.setItem("token", res.accessToken);
    });
  }

  getPublic() {
    this.isLoadingPublic = true;
    this.toastService.show('Info', 'Loading public endpoint...');
    this.mainService.getPublic().subscribe(
      (res: { status: string }) => {
        this.publicResponse = res;
        this.toastService.show('Info', 'Loading public endpoint finished successfully', 'success');
      },
      () => {
        this.isLoadingPublic = false;
        this.toastService.show('Info', 'Loading public endpoint did not finish', 'danger');
      }
    );
  }

  getProtected() {
    this.isLoadingPrivate = true;
    this.mainService.getProtected().subscribe(
      (res: { status: string }) => {
        console.log("protected", res);
        this.isLoadingPrivate = false;
      },
      (err: any) => {
        this.isLoadingPrivate = false;
        if (err.status === 401) {
          MainService.goToLogin();
        }
      }
    );
  }
}
