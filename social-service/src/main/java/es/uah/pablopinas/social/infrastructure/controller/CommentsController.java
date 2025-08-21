package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.application.ports.in.CommentUseCase;
import es.uah.pablopinas.social.domain.Comment;
import es.uah.pablopinas.social.domain.UserWithProfile;
import es.uah.pablopinas.social.infrastructure.controller.dto.CommentRequestDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.CommentResponseDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.UpdateCommentDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.UserWithProfileDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comments")
@RequiredArgsConstructor
public class CommentsController {
    private final CommentUseCase commentUseCase;

    @PostMapping
    public ResponseEntity<CommentResponseDTO> addComment(@RequestBody CommentRequestDTO dto) {
        Comment comment = commentUseCase.addComment(dto.getUserId(), dto.getReviewId(), dto.getText());
        return ResponseEntity.ok(toResponseDTO(comment, 0));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> listComments(@RequestParam String reviewId,
                                                                 @RequestParam String userId,
                                                                 @RequestParam(defaultValue = "0") int page,
                                                                 @RequestParam(defaultValue = "10") int size) {
        List<Comment> comments = commentUseCase.listComments(reviewId, userId, PageRequest.of(page, size));
        List<CommentResponseDTO> dtos = comments.stream().map(
                comment -> {
                    int likesCount = commentUseCase.getCommentLikes(comment.getId()).size();
                    return toResponseDTO(comment, likesCount);
                }
        ).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> getComment(@PathVariable String id) {
        Comment comment = commentUseCase.getComment(id);
        int likesCount = commentUseCase.getCommentLikes(id).size();
        return ResponseEntity.ok(toResponseDTO(comment, likesCount));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable String id,
                                                            @RequestBody UpdateCommentDTO dto) {
        Comment comment = commentUseCase.updateComment(id, dto.getUserId(), dto.getNewText());
        int likesCount = commentUseCase.getCommentLikes(id).size();
        return ResponseEntity.ok(toResponseDTO(comment, likesCount));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id,
                                              @RequestParam String userId) {
        commentUseCase.deleteComment(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeComment(@PathVariable String id,
                                            @RequestParam String userId) {
        commentUseCase.likeComment(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikeComment(@PathVariable String id,
                                              @RequestParam String userId) {
        commentUseCase.unlikeComment(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<List<UserWithProfileDTO>> getCommentLikes(@PathVariable String id) {
        List<UserWithProfile> users = commentUseCase.getCommentLikes(id);
        List<UserWithProfileDTO> dtos = users.stream().map(UserWithProfileDTO::toUserWithProfileDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private CommentResponseDTO toResponseDTO(Comment comment, int likesCount) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setUserId(comment.getUserId());
        dto.setReviewId(comment.getReviewId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null);
        dto.setLikesCount(likesCount);
        return dto;
    }


}
