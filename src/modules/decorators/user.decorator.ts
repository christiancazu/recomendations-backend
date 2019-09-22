import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data, req) => {
  console.log('REQ>>>> ', req.body);
  return req.body;
});
