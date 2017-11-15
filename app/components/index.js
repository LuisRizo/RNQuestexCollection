import { Navigation } from 'react-native-navigation';

import ArticleWeb from './ArticleWeb';
import Article from './Article';
import MiniArticle from './MiniArticle';

// register all screens of the app (including internal ones)
export function registerScreens() {
  Navigation.registerComponent('questex.ArticleWeb', () => ArticleWeb);
  Navigation.registerComponent('questex.Article', () => Article);
  Navigation.registerComponent('questex.MiniArticle', () => MiniArticle);
}
