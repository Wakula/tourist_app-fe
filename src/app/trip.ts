export class Trip {
  trip_id?: number;
  name: string;
  start_date: string;
  end_date?: string;
  description?: string;
  points? : Checkpoint[];
  admin_id?: number;
  admin?: string;
  participants?: number;
  status?: string;
  trip_uuid?: string;
  roles?: Role[];
}

export class Checkpoint {
  order_number : number;
  name: string;
  latitude: number;
  longitude: number;
}

export class Item {
  equipment_id?: number;
  name: string;
  weight: number;
  quantity: number;
  trip_id: number;
  role_id?: number;
  role_color?: string;
  owner_id?: number;
  users?: Array<any>;
}

export class Role {
  color: string;
  id: number;
  name: string;
  trip_id: number;
}

export class Group {
  level: number = 0;
  parent: Group;
}
