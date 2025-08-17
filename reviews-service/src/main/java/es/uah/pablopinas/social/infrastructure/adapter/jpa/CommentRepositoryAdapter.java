package es.uah.pablopinas.social.infrastructure.adapter.jpa;

import es.uah.pablopinas.social.application.ports.out.CommentsPort;
import es.uah.pablopinas.social.domain.Comment;
import es.uah.pablopinas.social.infrastructure.adapter.jpa.repository.CommentJpaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public class CommentRepositoryAdapter implements CommentsPort {
    private final CommentJpaRepository commentRepo;

    public CommentRepositoryAdapter(CommentJpaRepository commentRepo) {
        this.commentRepo = commentRepo;
    }

    @Override
    public Comment save(Comment comment) {
        return commentRepo.save(comment);
    }

    @Override
    public List<Comment> findByReviewId(UUID reviewId, PageRequest page) {
        return commentRepo.findByReviewId(reviewId, page);
    }

    @Override
    public List<Comment> findByUserId(UUID userId, PageRequest page) {
        return commentRepo.findByUserId(userId, page);
    }

    @Override
    public Optional<Comment> findById(UUID commentId) {
        return commentRepo.findById(commentId);
    }

    @Override
    public void delete(Comment comment) {
        commentRepo.delete(comment);
    }
}

