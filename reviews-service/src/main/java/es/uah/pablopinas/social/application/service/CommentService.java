package es.uah.pablopinas.social.application.service;

import es.uah.pablopinas.social.application.ports.in.CommentUseCase;
import es.uah.pablopinas.social.application.ports.out.*;
import es.uah.pablopinas.social.domain.*;
import es.uah.pablopinas.social.domain.exceptions.ForbiddenException;
import es.uah.pablopinas.social.domain.exceptions.NotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService implements CommentUseCase {
    private final CommentsPort commentRepo;
    private final ReviewsPort reviewRepo;
    private final ActivityPort activityPort;
    private final LikesPort likeRepo;
    private final UserWithProfilesPort usersPort;

    public Comment addComment(UUID userId, UUID reviewId, String text) {
        if (!reviewRepo.existsById(reviewId)) throw new NotFoundException("Review not found");

        Comment comment = new Comment(userId, reviewId, text);
        Comment saved = commentRepo.save(comment);
        activityPort.notifyActivity(comment);
        return saved;
    }

    public List<Comment> listComments(UUID reviewId, UUID userId, PageRequest page) {
        if (reviewId != null) {
            return commentRepo.findByReviewId(reviewId, page);
        } else if (userId != null) {
            return commentRepo.findByUserId(userId, page);
        } else {
            throw new IllegalArgumentException("A filter must be provided");
        }
    }

    public Comment getComment(UUID commentId) {
        return commentRepo.findById(commentId)
                .orElseThrow(() -> new NotFoundException("Comment not found"));
    }

    public Comment updateComment(UUID commentId, UUID userId, String newText) {
        Comment comment = getComment(commentId);
        if (!comment.getUserId().equals(userId)) {
            throw new ForbiddenException("Cannot edit others' comment");
        }
        comment.updateText(newText);
        return commentRepo.save(comment);
    }

    public void deleteComment(UUID commentId, UUID userId) {
        Comment comment = getComment(commentId);
        if (!comment.getUserId().equals(userId)) {
            throw new ForbiddenException("Cannot delete others' comment");
        }
        commentRepo.delete(comment);
    }

    public void likeComment(UUID commentId, UUID userId) {
        if (likeRepo.existsByUserIdAndTarget(userId, commentId)) return;
        Like like = likeRepo.save(new Like(userId, commentId, LikeableType.COMMENT));
        activityPort.notifyActivity(like);
    }

    public void unlikeComment(UUID commentId, UUID userId) {
        likeRepo.deleteByUserIdAndTarget(userId, commentId);
    }

    public List<UserWithProfile> getCommentLikes(UUID commentId) {
        List<UUID> userIds = likeRepo.findAllUserIdsByTarget(commentId);
        return usersPort.getUsersByIds(userIds);
    }
}
