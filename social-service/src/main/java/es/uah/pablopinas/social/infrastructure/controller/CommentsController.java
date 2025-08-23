package es.uah.pablopinas.social.infrastructure.controller;

import es.uah.pablopinas.social.application.ports.in.CommentUseCase;
import es.uah.pablopinas.social.application.ports.out.UserWithProfilesPort;
import es.uah.pablopinas.social.domain.Comment;
import es.uah.pablopinas.social.domain.UserWithProfile;
import es.uah.pablopinas.social.infrastructure.controller.dto.CommentRequestDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.CommentResponseDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.UpdateCommentDTO;
import es.uah.pablopinas.social.infrastructure.controller.dto.UserWithProfileDTO;
import es.uah.pablopinas.social.infrastructure.security.AuthUser;
import es.uah.pablopinas.social.infrastructure.security.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/comments")
public class CommentsController {
    private final CommentUseCase commentUseCase;
    private final UserWithProfilesPort userPort;

    public CommentsController(CommentUseCase commentUseCase, UserWithProfilesPort userPort) {
        this.commentUseCase = commentUseCase;
        this.userPort = userPort;
    }

    @PostMapping
    public ResponseEntity<CommentResponseDTO> addComment(@RequestBody CommentRequestDTO dto, @CurrentUser AuthUser user) {
        Comment comment = commentUseCase.addComment(user.id(), dto.getReviewId(), dto.getText());
        UserWithProfile userProfile = userPort.getUser(comment.getUserId()).orElse(null);
        return ResponseEntity.ok(toResponseDTO(comment, userProfile, 0, false));
    }

    @GetMapping
    public ResponseEntity<List<CommentResponseDTO>> listComments(
            @CurrentUser AuthUser user,
            @RequestParam(required = false) String reviewId,
            @RequestParam(required = false) String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        List<Comment> comments = commentUseCase.listComments(reviewId, userId, PageRequest.of(page, size));
        List<CommentResponseDTO> dtos = comments.stream().map(
                comment -> {
                    List<UserWithProfile> likes = commentUseCase.getCommentLikes(comment.getCommentId());
                    int likesCount = likes.size();
                    UserWithProfile userWithProfile = userPort.getUser(comment.getUserId()).orElse(null);
                    boolean likedByCurrentUser = likes.stream().anyMatch(u -> u.user().getId().equals(user.id()));
                    return toResponseDTO(comment, userWithProfile, likesCount, likedByCurrentUser);
                }
        ).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> getComment(@PathVariable String id, @CurrentUser AuthUser user) {
        Comment comment = commentUseCase.getComment(id);
        List<UserWithProfile> likes = commentUseCase.getCommentLikes(id);
        int likesCount = likes.size();
        UserWithProfile userWithProfile = userPort.getUser(comment.getUserId()).orElse(null);
        boolean likedByCurrentUser = likes.stream().anyMatch(u -> u.user().getId().equals(user.id()));
        return ResponseEntity.ok(toResponseDTO(comment, userWithProfile, likesCount, likedByCurrentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CommentResponseDTO> updateComment(@PathVariable String id,
                                                            @RequestBody UpdateCommentDTO dto) {
        Comment comment = commentUseCase.updateComment(id, dto.getUserId(), dto.getNewText());
        List<UserWithProfile> likes = commentUseCase.getCommentLikes(id);
        int likesCount = likes.size();
        UserWithProfile userWithProfile = userPort.getUser(comment.getUserId()).orElse(null);
        boolean likedByCurrentUser = likes.stream().anyMatch(u -> u.user().getId().equals(dto.getUserId()));

        return ResponseEntity.ok(toResponseDTO(comment, userWithProfile, likesCount, likedByCurrentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComment(@PathVariable String id,
                                              @RequestParam String userId) {
        commentUseCase.deleteComment(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Void> likeComment(@PathVariable String id,
                                            @CurrentUser AuthUser user) {
        String userId = user.id();
        commentUseCase.likeComment(id, userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/like")
    public ResponseEntity<Void> unlikeComment(@PathVariable String id,
                                              @CurrentUser AuthUser user) {
        String userId = user.id();
        commentUseCase.unlikeComment(id, userId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<List<UserWithProfileDTO>> getCommentLikes(@PathVariable String id) {
        List<UserWithProfile> users = commentUseCase.getCommentLikes(id);
        List<UserWithProfileDTO> dtos = users.stream().map(UserWithProfileDTO::toUserWithProfileDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private CommentResponseDTO toResponseDTO(Comment comment, UserWithProfile user, int likesCount, boolean likedByCurrentUser) {
        CommentResponseDTO dto = new CommentResponseDTO();
        dto.setId(comment.getId());
        dto.setReviewId(comment.getReviewId());
        dto.setText(comment.getText());
        dto.setCreatedAt(comment.getCreatedAt() != null ? comment.getCreatedAt().toString() : null);
        dto.setLikesCount(likesCount);
        dto.setUser(UserWithProfileDTO.toUserWithProfileDTO(user));
        dto.setLikedByCurrentUser(likedByCurrentUser);
        return dto;
    }
}
