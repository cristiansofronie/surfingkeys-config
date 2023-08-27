import { getContent } from '../utils';

if (location.href.startsWith('https://www.digitalocean.com')) {
  const query = '.ContainerStyles__StyledContainer-sc-1vejnbq-0';
  const ignore_query =
    '.TutorialTemplateStyles__StyledRecordHeaderContainer-sc-1gdp4d7-0, div.ContainerStyles__StyledContainer-sc-1vejnbq-0.bdIXEX > TutorialTemplateStyles__StyledRecordHeaderContainer-sc-1gdp4d7-0.bxFSMP, .TutorialTemplateStyles__StyledCollaboratorsFooter-sc-1gdp4d7-13, .QuestionSearchFooterStyles__StyledQuestionSearchFooterContainer-sc-175aseh-0, .TutorialTemplateStyles__StyledCTA-sc-1gdp4d7-30, .WasThisHelpfulStyles__StyledContainer-sc-ugfqut-0, .TutorialTemplateStyles__StyledCreativeCommonsLicense-sc-1gdp4d7-24, .ContainerStyles__StyledContainer-sc-1vejnbq-0 > .container';
  getContent(ignore_query, query);
}
