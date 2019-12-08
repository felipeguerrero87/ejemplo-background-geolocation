import { Component, OnInit } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationConfig, BackgroundGeolocationEvents, BackgroundGeolocationResponse } from '@ionic-native/background-geolocation/ngx';
import { geoSupervisorModel } from '../models/geosupervisor.model';
import { HttpService } from '../services/http.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit{

  estado

  datoSupervisor: geoSupervisorModel = new geoSupervisorModel()

  constructor(private backgroundGeolocation: BackgroundGeolocation, private httpService: HttpService) {}

  ngOnInit(){
    this.gps();
  }

  gps(){
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 10,
      distanceFilter: 10,
      notificationTitle: "Sisguard",
      notificationText: "GPS habilitado",
      interval: 6000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      //startOnBoot: true,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
    
      //url: 'http://www.sisguard.cl:2040/api/trackSupervisor',
      // httpHeaders: {
      //   'Content-Type':'application/json'
      // },
      // postTemplate: {
      //   Latitud: '@latitude',
      //   Longitud: '@longitud',
      //   IMEI: '352012090394718',
      //   Accuracy:  '@accuracy',
      //   Velocidad: '@speed',
      //   Angulo: '@bearing',
      //   FechaHora: '@time'
      // }
    }

    this.backgroundGeolocation.configure(config).then(() => {
      this.estado = this.backgroundGeolocation.checkStatus()
        .then((status) => {
          // console.log('status.authorization: ' + status.authorization)
          // console.log('status.isRunning: ' + status.isRunning)
          // console.log('status.locationServicesEnabled: ' + status.locationServicesEnabled)
        })
    });

    this.backgroundGeolocation.on(BackgroundGeolocationEvents.location)
      .subscribe((location: BackgroundGeolocationResponse) => {
        console.log('Latitud: ' + location.latitude.toString());
        console.log('Longitud: ' + location.longitude.toString());
        this.datoSupervisor.Latitud = location.latitude;
        this.datoSupervisor.Longitud = location.longitude;
        this.datoSupervisor.Velocidad = location.speed;
        this.datoSupervisor.Angulo = location.bearing;
        this.datoSupervisor.Accuracy = location.accuracy;
        this.datoSupervisor.FechaHora = location.time;
        this.httpService.postTrack(this.datoSupervisor).subscribe(()=>{
          console.log('mensaje enviado')
        })
      });

    this.backgroundGeolocation.on(BackgroundGeolocationEvents.http_authorization)
      .subscribe((httpAuth:BackgroundGeolocationResponse) => {
        console.log(httpAuth);
      });


    this.backgroundGeolocation.start();
  }

}
