package es.uah.pablopinas.social.application.ports.in;

import es.uah.pablopinas.social.domain.Comment;
import es.uah.pablopinas.social.domain.UserWithProfile;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.UUID;

public interface CommentUseCase {
    Comment addComment(UUID userId, UUID reviewId, String text);
    List<Comment> listComments(UUID reviewId, UUID userId, PageRequest page);
    Comment getComment(UUID commentId);
    Comment updateComment(UUID commentId, UUID userId, String newText);
    void deleteComment(UUID commentId, UUID userId);
    void likeComment(UUID commentId, UUID userId);
    void unlikeComment(UUID commentId, UUID userId);
    List<UserWithProfile> getCommentLikes(UUID commentId);
}

