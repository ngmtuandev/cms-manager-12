export const getSize = (idSize: number): null | any => {
  const sizes = [
    {
      id: 1,
      name: 'M',
      caption: '(1m50 - 1m62 | 51kg - 59kg)',
    },
    {
      id: 2,
      name: 'L',
      caption: '(1m62 - 1m69 | 60kg - 68kg)',
    },
    {
      id: 3,
      name: 'XL',
      caption: '(1m70 - 1m76 | 69kg - 77kg)',
    },
    {
      id: 4,
      name: '2XL',
      caption: '(1m77 - 1m83 | 78kg - 81kg)',
    },
    {
      id: 5,
      name: '3XL',
      caption: '(1m84 - 1m88 | 85kg - 89kg)',
    },
  ];

  // Using array.find method
  const size = sizes.find(size => size.id === idSize);

  // If size is found, return it; otherwise, return null or handle as needed
  return size || null;
};