export interface DocumentData {
  investigationId: string;
  createdAt: any;
  description: string;
  fileURL: string;
  title: string;
  userId: string;
  image: any;
  date: string;
}

export interface DetectedPlate {
  model: string;
  plate: string;
  color: string;
  situation: string;
  videoMoment: string;
}

export interface DetectedVehicle {
  Model: string;
  Plate: string;
  Cor: string;
  Situation: string;
  videoFrame: string;
}
