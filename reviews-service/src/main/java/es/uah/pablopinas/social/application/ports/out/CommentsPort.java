package es.uah.pablopinas.social.application.ports.out;

import es.uah.pablopinas.social.domain.Comment;
import org.springframework.data.domain.PageRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CommentsPort {
    Comment save(Comment comment);

    List<Comment> findByReviewId(UUID reviewId, PageRequest page);

    List<Comment> findByUserId(UUID userId, PageRequest page);

    Optional<Comment> findById(UUID commentId);

    void delete(Comment comment);
}
