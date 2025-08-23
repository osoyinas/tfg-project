package es.uah.pablopinas.social.application.ports.in;

import es.uah.pablopinas.social.domain.Comment;
import es.uah.pablopinas.social.domain.UserWithProfile;
import org.springframework.data.domain.PageRequest;

import java.util.List;

public interface CommentUseCase {
    Comment addComment(String userId, String reviewId, String text);

    List<Comment> listComments(String reviewId, String userId, PageRequest page);

    Comment getComment(String commentId);

    Comment updateComment(String commentId, String userId, String newText);

    void deleteComment(String commentId, String userId);

    void likeComment(String commentId, String userId);

    void unlikeComment(String commentId, String userId);

    List<UserWithProfile> getCommentLikes(String commentId);

    int getCommentsCount(String id);
}

