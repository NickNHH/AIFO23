export const botAvatar: string = '../../assets/YTChatbotPB.png';

export const gifsLinks: string[] = [
  'https://media.tenor.com/images/ac287fd06319e47b1533737662d5bfe8/tenor.gif',
  'https://i.gifer.com/no.gif',
  'https://techcrunch.com/wp-content/uploads/2015/08/safe_image.gif',
  'http://www.reactiongifs.com/r/wnd1.gif',
  'https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExanlmYjQyeG1rc2s5ZGdsdzdscHFmcXl2Z3cxMm16c3NmbzF2d2ViYyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/YUWhoviTywdJ3xoArT/giphy.g'
];
export const imageLinks: string[] = [
  'https://picsum.photos/320/240/?image=357',
  'https://picsum.photos/320/240/?image=556',
  'https://picsum.photos/320/240/?image=339',
  'https://picsum.photos/320/240/?image=387',
  'https://picsum.photos/320/240/?image=30',
  'https://picsum.photos/320/240/?image=271',
];
const fileLink: string = 'http://google.com';

export const botReplies = [
  {
    regExp: /([H,h]ey)|([H,h]i)/g,
    answerArray: ['Hello!', 'Yes?', 'Yes, milord?', 'What can I do for you?'],
    type: 'text',
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([H,h]elp)/g,
    answerArray: [`No problem! Try sending a message containing word "hey", "image",
    "gif", "file", "map", "quote", "file group" to see different message components`],
    type: 'text',
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([I,i]mage)|(IMAGE)|([P,p]ic)|(Picture)/g,
    answerArray: ['Hey look at this!', 'Ready to work', 'Yes, master.'],
    type: 'pic',
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      type: 'file',
      files: [
        {
          url: '',
          type: 'image/jpeg',
        },
      ],
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([G,g]if)|(GIF)/g,
    type: 'gif',
    answerArray: ['No problem', 'Well done', 'You got it man'],
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      type: 'file',
      files: [
        {
          url: '',
          type: 'image/gif',
        },
      ],
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([F,f]ile group)|(FILE)/g,
    type: 'group',
    answerArray: ['Take it!', 'Job Done.', 'As you wish'],
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      type: 'file',
      files: [
        {
          url: fileLink,
          icon: 'file-text-outline',
        },
        {
          url: '',
          type: 'image/gif',
        },
        {
          url: '',
          type: 'image/jpeg',
        },
      ],
      icon: 'file-text-outline',
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([F,f]ile)|(FILE)/g,
    type: 'file',
    answerArray: ['Take it!', 'Job Done.', 'As you wish'],
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      type: 'file',
      files: [
        {
          url: fileLink,
          icon: 'file-text-outline',
        },
      ],
      icon: 'file-text-outline',
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([M,m]ap)|(MAP)/g,
    type: 'map',
    answerArray: ['Done.', 'My sight is yours.', 'I shall be your eyes.'],
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      type: 'map',
      latitude: 53.914321,
      longitude: 27.5998355,
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /([Q,q]uote)|(QUOTE)/g,
    type: 'quote',
    answerArray: ['Quoted!', 'Say no more.', 'I gladly obey.'],
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      type: 'quote',
      quote: '',
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
  {
    regExp: /(.*)/g,
    answerArray: ['Hello there! Try typing "help"'],
    type: 'text',
    reply: {
      text: '',
      reply: false,
      date: new Date(),
      user: {
        name: 'YTBot',
        avatar: botAvatar,
      },
    },
  },
];
