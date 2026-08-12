// ══════════════════════════════════════
//  NestFinder — Seed Data
// ══════════════════════════════════════

const USERS_SEED = [
  { id:'u1', name:'Rahim Uddin',  email:'owner@demo.com',    phone:'01711000001', password:'1234', role:'owner'    },
  { id:'u2', name:'Karim Ahmed',  email:'customer@demo.com', phone:'01711000002', password:'1234', role:'customer' },
  { id:'u3', name:'Admin User',   email:'admin@demo.com',    phone:'01711000003', password:'1234', role:'admin'    },
];

const FLATS_SEED = [
  {
    id:'f1', ownerId:'u1',
    title:'Premium 3-Bed Apartment', location:'Gulshan-2, Dhaka',
    rent:55000, beds:3, baths:2, area:1800,
    facilities:['Central AC','Parking','Generator','CCTV','Lift'],
    description:'A fully furnished luxury apartment in prime Gulshan location. Floor-to-ceiling windows, modern fittings, and 24/7 security.',
    status:'available',
  },
  {
    id:'f2', ownerId:'u1',
    title:'Modern 2-Bed Flat', location:'Banani, Dhaka',
    rent:32000, beds:2, baths:2, area:1100,
    facilities:['AC','Lift','Gas','Water 24/7'],
    description:'Contemporary flat in vibrant Banani. Open-plan living, fully tiled bathrooms, and a bright fitted kitchen.',
    status:'available',
  },
  {
    id:'f3', ownerId:'u1',
    title:'Cozy Studio Apartment', location:'Dhanmondi, Dhaka',
    rent:18000, beds:1, baths:1, area:650,
    facilities:['Gas','Water 24/7','Security'],
    description:'Perfect for students and young professionals. Efficient layout with all essentials included.',
    status:'rented',
  },
];

const PHOTO_SETS_SEED = {
  f1:{
    building:'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=80',
    interior:[
      {url:'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=700&q=80', label:'Living Room'},
      {url:'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=700&q=80', label:'Master Bedroom'},
      {url:'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=700&q=80', label:'Kitchen'},
      {url:'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=700&q=80', label:'Bathroom'},
      {url:'https://images.unsplash.com/photo-1502005097973-6a7082348e28?w=700&q=80', label:'Balcony'},
    ],
    video:null,
  },
  f2:{
    building:'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
    interior:[
      {url:'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=700&q=80', label:'Living Room'},
      {url:'https://images.unsplash.com/photo-1588854337115-1c67d9247e4d?w=700&q=80', label:'Bedroom'},
      {url:'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=700&q=80', label:'Kitchen'},
      {url:'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=700&q=80', label:'Bathroom'},
    ],
    video:null,
  },
  f3:{
    building:'https://images.unsplash.com/photo-1460317442991-0ec209397118?w=900&q=80',
    interior:[
      {url:'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=700&q=80', label:'Studio Space'},
      {url:'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=700&q=80', label:'Kitchen Area'},
      {url:'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=700&q=80', label:'Bathroom'},
    ],
    video:null,
  },
};

const REQUESTS_SEED = [
  { id:'r1', flatId:'f2', customerId:'u2', customerName:'Karim Ahmed', message:'Interested in renting for 1 year. Can move in next month.', status:'pending', date:'2026-01-10' },
];

const NOTIFS_SEED = [
  { id:'n1', userId:'u2', text:"Your booking request for 'Modern 2-Bed Flat' has been submitted and is under review.", type:'info',  time:'2026-01-10 10:00' },
  { id:'n2', userId:'u1', text:"New booking request from Karim Ahmed for 'Modern 2-Bed Flat'.",                        type:'warn',  time:'2026-01-10 10:01' },
];
