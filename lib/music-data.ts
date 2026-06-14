export const musicDatabase = [
  // Classics
  { id: 'dQw4w9WgXcQ', title: 'Never Gonna Give You Up', artist: 'Rick Astley', duration: 213, thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/default.jpg' },
  { id: '9bZkp7q19f0', title: 'Bohemian Rhapsody', artist: 'Queen', duration: 354, thumbnail: 'https://img.youtube.com/vi/9bZkp7q19f0/default.jpg' },
  { id: 'jNQXAC9IVRw', title: 'Me at the zoo', artist: 'Jawed Karim', duration: 18, thumbnail: 'https://img.youtube.com/vi/jNQXAC9IVRw/default.jpg' },
  
  // Pop
  { id: 'kJQP7kiw9Fk', title: 'Blinding Lights', artist: 'The Weeknd', duration: 200, thumbnail: 'https://img.youtube.com/vi/kJQP7kiw9Fk/default.jpg' },
  { id: 'ZXsQAXx_ao0', title: 'Levitating', artist: 'Dua Lipa', duration: 203, thumbnail: 'https://img.youtube.com/vi/ZXsQAXx_ao0/default.jpg' },
  { id: 'kffacxfA7g4', title: 'Good 4 U', artist: 'Olivia Rodrigo', duration: 178, thumbnail: 'https://img.youtube.com/vi/kffacxfA7g4/default.jpg' },
  { id: 'BiI8vx1jCfE', title: 'As It Was', artist: 'Harry Styles', duration: 183, thumbnail: 'https://img.youtube.com/vi/BiI8vx1jCfE/default.jpg' },
  
  // Rock
  { id: 'TkZiLj3zBLY', title: 'Stairway to Heaven', artist: 'Led Zeppelin', duration: 482, thumbnail: 'https://img.youtube.com/vi/TkZiLj3zBLY/default.jpg' },
  { id: 'OMOGaugKpzs', title: 'Hotel California', artist: 'Eagles', duration: 391, thumbnail: 'https://img.youtube.com/vi/OMOGaugKpzs/default.jpg' },
  { id: 'CD-E-B_BF5w', title: 'Sweet Child O Mine', artist: 'Guns N Roses', duration: 356, thumbnail: 'https://img.youtube.com/vi/CD-E-B_BF5w/default.jpg' },
  { id: 'F1B4Vpo6mUE', title: 'Imagine', artist: 'John Lennon', duration: 183, thumbnail: 'https://img.youtube.com/vi/F1B4Vpo6mUE/default.jpg' },
  
  // Hip Hop
  { id: '61tHv95qkWI', title: 'Lose Yourself', artist: 'Eminem', duration: 326, thumbnail: 'https://img.youtube.com/vi/61tHv95qkWI/default.jpg' },
  { id: 'wIft-t-MQuE', title: 'One Dance', artist: 'Drake ft. Wizkid', duration: 287, thumbnail: 'https://img.youtube.com/vi/wIft-t-MQuE/default.jpg' },
  { id: 'r7zBmKVuRFM', title: 'Hotline Bling', artist: 'Drake', duration: 271, thumbnail: 'https://img.youtube.com/vi/r7zBmKVuRFM/default.jpg' },
  { id: 'xo1VtsLEFZw', title: 'God\'s Plan', artist: 'Drake', duration: 244, thumbnail: 'https://img.youtube.com/vi/xo1VtsLEFZw/default.jpg' },
  
  // Electronic
  { id: 'k7X8Xj8LxHE', title: 'Animals', artist: 'Martin Garrix', duration: 285, thumbnail: 'https://img.youtube.com/vi/k7X8Xj8LxHE/default.jpg' },
  { id: '60Ok8HERE_Y', title: 'Titanium', artist: 'David Guetta ft. Sia', duration: 244, thumbnail: 'https://img.youtube.com/vi/60Ok8HERE_Y/default.jpg' },
  { id: 'e-IWRmpefzE', title: 'Levels', artist: 'Avicii', duration: 258, thumbnail: 'https://img.youtube.com/vi/e-IWRmpefzE/default.jpg' },
  
  // Indie
  { id: 'dvgZkm2zsAM', title: 'Creep', artist: 'Radiohead', duration: 238, thumbnail: 'https://img.youtube.com/vi/dvgZkm2zsAM/default.jpg' },
  { id: '2H7M78DUWU8', title: 'Sex on Fire', artist: 'Kings of Leon', duration: 244, thumbnail: 'https://img.youtube.com/vi/2H7M78DUWU8/default.jpg' },
  
  // Soul/R&B
  { id: 'lfBHcY27qEU', title: 'Thinking Out Loud', artist: 'Ed Sheeran', duration: 282, thumbnail: 'https://img.youtube.com/vi/lfBHcY27qEU/default.jpg' },
  { id: 'PVjiKRNQnRI', title: 'Redbone', artist: 'Childish Gambino', duration: 234, thumbnail: 'https://img.youtube.com/vi/PVjiKRNQnRI/default.jpg' },
  
  // Country
  { id: 'ZCymQlmYself', title: 'Jolene', artist: 'Dolly Parton', duration: 218, thumbnail: 'https://img.youtube.com/vi/ZCymQlmYself/default.jpg' },
  { id: 'w0aB2Vr32Ts', title: 'Take Me Home, Country Roads', artist: 'John Denver', duration: 210, thumbnail: 'https://img.youtube.com/vi/w0aB2Vr32Ts/default.jpg' },
]

export function searchMusic(query: string) {
  const lowerQuery = query.toLowerCase().trim()
  
  return musicDatabase.filter(song => 
    song.title.toLowerCase().includes(lowerQuery) ||
    song.artist.toLowerCase().includes(lowerQuery)
  )
}
