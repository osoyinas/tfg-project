package es.uah.pablopinas.social.infrastructure.adapter.jpa.repository;

import es.uah.pablopinas.social.domain.Comment;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CommentJpaRepository extends JpaRepository<Comment, String> {
    List<Comment> findByReviewId(String reviewId, PageRequest page);
    List<Comment> findByUserId(String userId, PageRequest page);
    int countByReviewId(String reviewId);
}

