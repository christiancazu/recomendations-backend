export interface IBaseService<T, createDto, updateDto> {

  findAll(): Promise<T[]>;

  create(dto: createDto): Promise<T>;

  findById(id: string): Promise<T | null>;

  findOne(options: object): Promise<T | null>;

  update(id: string, dto: updateDto): Promise<T>;

  delete(id: string): Promise<string>;
  
}
