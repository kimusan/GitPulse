import { DiscussionSummary, ThreadComment } from '../types/github';
import { StorageService } from './storageService';
import { getGraphQLEndpoint } from '../utils/githubEndpoints';

export class GitHubGraphQLService {
  static async fetchDiscussions(owner: string, repo: string): Promise<{
    discussionsCount: number;
    discussionCommentsCount: number;
    discussions: DiscussionSummary[];
  }> {
    const token = StorageService.getAuthToken();
    if (!token) {
      return { discussionsCount: 0, discussionCommentsCount: 0, discussions: [] };
    }

    const endpoint = getGraphQLEndpoint(StorageService.getInstanceUrl());

    const query = `
      query GetRepoDiscussions($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          discussions(first: 10, orderBy: { field: CREATED_AT, direction: DESC }) {
            totalCount
            nodes {
              id
              number
              title
              body
              createdAt
              upvoteCount
              category {
                name
                emoji
              }
              author {
                login
                avatarUrl
              }
              comments(first: 10) {
                totalCount
                nodes {
                  id
                  body
                  createdAt
                  author {
                    login
                    avatarUrl
                  }
                }
              }
            }
          }
        }
      }
    `;

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query,
          variables: { owner, name: repo }
        })
      });

      if (!res.ok) {
        return { discussionsCount: 0, discussionCommentsCount: 0, discussions: [] };
      }

      const json = await res.json();
      const discussionsNode = json.data?.repository?.discussions;

      if (!discussionsNode) {
        return { discussionsCount: 0, discussionCommentsCount: 0, discussions: [] };
      }

      const discussionsCount = discussionsNode.totalCount || 0;
      let totalDiscussionComments = 0;

      const discussions: DiscussionSummary[] = (discussionsNode.nodes || []).map((d: any) => {
        const commentsCount = d.comments?.totalCount || 0;
        totalDiscussionComments += commentsCount;

        const commentsList: ThreadComment[] = (d.comments?.nodes || []).map((c: any) => ({
          id: c.id,
          body: c.body || '',
          created_at: c.createdAt,
          user: {
            login: c.author?.login || 'ghost',
            avatar_url: c.author?.avatarUrl || 'https://avatars.githubusercontent.com/u/10137?v=4'
          }
        }));

        return {
          id: d.id,
          number: d.number,
          title: d.title,
          body: d.body,
          createdAt: d.createdAt,
          commentsCount,
          category: {
            name: d.category?.name || 'General',
            emoji: d.category?.emoji || '💬'
          },
          author: {
            login: d.author?.login || 'ghost',
            avatarUrl: d.author?.avatarUrl || 'https://avatars.githubusercontent.com/u/10137?v=4'
          },
          upvoteCount: d.upvoteCount || 0,
          commentsList
        };
      });

      return {
        discussionsCount,
        discussionCommentsCount: totalDiscussionComments,
        discussions
      };
    } catch {
      return { discussionsCount: 0, discussionCommentsCount: 0, discussions: [] };
    }
  }
}
