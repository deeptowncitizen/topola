import {getDate, gedcomToJson} from '../src/gedcom';


describe('GEDCOM parser', () => {
  describe('date', () => {
    it('should parse a simple date', () => {
      expect(getDate('9 JUN 2019')).toEqual({date: {day: 9, month: 6, year: 2019}});
    });
    it('should parse partial dates', () => {
      expect(getDate('2019')).toEqual({date: {year: 2019}});
      expect(getDate('JUN 2019')).toEqual({date: {month: 6, year: 2019}});
      expect(getDate('9 JUN')).toEqual({date: {day: 9, month: 6}});
    });
    it('should parse dates before year 1000', () => {
      expect(getDate('6')).toEqual({date: {year: 6}});
      expect(getDate('66')).toEqual({date: {year: 66}});
      expect(getDate('966')).toEqual({date: {year: 966}});
      expect(getDate('JUN 966')).toEqual({date: {month: 6, year: 966}});
      expect(getDate('9 JUN 966')).toEqual({date: {day: 9, month: 6, year: 966}});
    });
  });

  describe('Name', () => {
    it('should parse name correctly', () => {
      let gedcom = `
      0 @I1@ INDI
      1 NAME John /Doe/
      `;
  
      let sut = gedcomToJson(gedcom);
      expect(sut.indis[0].firstName).toBe('John');
      expect(sut.indis[0].lastName).toBe('Doe');
    });
    it('should parse maiden name correctly', () => {
      let gedcom = `
      0 @I1@ INDI
      1 NAME Jane /Doe/
      1 NAME /Smith/
      2 TYPE maiden
      `;
  
      let sut = gedcomToJson(gedcom);
      expect(sut.indis[0].firstName).toBe('Jane');
      expect(sut.indis[0].lastName).toBe('Doe');
      expect(sut.indis[0].maidenName).toBe('Smith');
    });
  });

  describe('Images', () => {
    it('should parse a single image object correctly', () => {
      let gedcom = `
      0 @I1@ INDI
      1 OBJE
      2 FILE person.jpg
      `;
  
      let sut = gedcomToJson(gedcom);
      expect(sut.indis.length).toBe(1);
      expect(sut.indis[0].imageUrl!.url).toBe('person.jpg');
    });
    it('should parse a single image with title correctly', () => {
      let gedcom = `
      0 @I1@ INDI
      1 OBJE
      2 FILE person.jpg
      2 TITL some description
      `;
  
      let sut = gedcomToJson(gedcom);
      expect(sut.indis.length).toBe(1);
      expect(sut.indis[0].imageUrl!.url).toBe('person.jpg');
      expect(sut.indis[0].imageUrl!.title).toBe('some description');
    });
    it('should parse multiple image objects correctly', () => {
      let gedcom = `
      0 @I1@ INDI
      1 OBJE
      2 FILE main.jpg
      2 TITL some
      1 OBJE
      2 FILE album.jpg
      2 TITL description
      `;
  
      let sut = gedcomToJson(gedcom);
      expect(sut.indis.length).toBe(1);
      expect(sut.indis[0].imageUrl!.url).toBe('main.jpg');
      expect(sut.indis[0].imageUrl!.title).toBe('some');
  
      expect(sut.indis[0].images!.length).toBe(1);
      expect(sut.indis[0].images![0].url).toBe('album.jpg');
      expect(sut.indis[0].images![0].title).toBe('description');
    });
  });
});
