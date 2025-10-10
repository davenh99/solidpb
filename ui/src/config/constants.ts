export const DROP_ABOVE_CLASS = `
  relative 
  before:absolute 
  before:inset-x-1
  before:top-0
  before:h-1 
  before:rounded-full 
  before:bg-blue-500
  before:content-['']
`;

export const DROP_BELOW_CLASS = `
  relative 
  after:absolute 
  after:inset-x-1
  after:bottom-0 
  after:h-1 
  after:rounded-full 
  after:bg-blue-500 
  after:content-['']
`;
