<template>
  <eb-page ptr @ptr:refresh="loadMore">
    <eb-navbar large largeTransparent :title="$text('Pull To Refresh')" eb-back-link="Back"></eb-navbar>
    <f7-list media-list>
      <f7-list-item v-for="(item, index) in items" :key="index" :title="item.title" :subtitle="item.author">
        <img slot="media" :src="item.cover" width="44" />
      </f7-list-item>
      <f7-block-footer>
        <p>Just pull page down to let the magic happen.<br>Note that pull-to-refresh feature is optimised for touch and native scrolling so it may not work on desktop browser.</p>
      </f7-block-footer>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      items: [{
        title: 'Yellow Submarine',
        author: 'Beatles',
        cover: 'https://cdn.framework7.io/placeholder/abstract-88x88-1.jpg',
      },
      {
        title: 'Don\'t Stop Me Now',
        author: 'Queen',
        cover: 'https://cdn.framework7.io/placeholder/abstract-88x88-2.jpg',
      },
      {
        title: 'Billie Jean',
        author: 'Michael Jackson',
        cover: 'https://cdn.framework7.io/placeholder/abstract-88x88-3.jpg',
      },
      ],
      songs: [ 'Yellow Submarine', 'Don\'t Stop Me Now', 'Billie Jean', 'Californication' ],
      authors: [ 'Beatles', 'Queen', 'Michael Jackson', 'Red Hot Chili Peppers' ],
    };
  },
  methods: {
    loadMore(done) {
      const self = this;

      setTimeout(() => {
        const picURL = `https://cdn.framework7.io/placeholder/abstract-88x88-${(Math.floor(Math.random() * 10) + 1)}.jpg`;
        const song = self.songs[Math.floor(Math.random() * self.songs.length)];
        const author = self.authors[Math.floor(Math.random() * self.authors.length)];

        self.items.push({
          title: song,
          author,
          cover: picURL,
        });

        done();
      }, 1000);
    },
  },
};

</script>
